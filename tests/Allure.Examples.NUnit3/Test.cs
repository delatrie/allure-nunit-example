using NUnit.Framework;

namespace Allure.Examples.NUnit3
{
    public class Test
    {
        [Test]
        public void Fail()
        {
            Assert.Fail();
        }
    }
}
